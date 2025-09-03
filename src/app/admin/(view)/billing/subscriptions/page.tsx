

'use client';

import { useGetAllSubscriptionPlansQuery, useUpdateAdonsAndPlanMutation } from '@/redux/features/store/SubscriptionApi';
import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

// --- Type Definitions for State Management ---
interface Feature {
  id: number;
  text: string;
}

// Added 'type' and 'badge' to match API structure
interface AddOn {
  id: number;
  title: string;
  price: string;
  description: string;
  type: string;
  badge: string | null;
}

interface Plan {
  id: string | number;
  title: string;
  price: string;
  description: string;
  features: Feature[];
  type: string; // Added 'type' to match API structure
  badge: string | null;
}

// --- Default structure for the state before API data is loaded ---
const defaultState = {
  globalAddOns: [],
  store: null,
  brand: null,
  wholesaler: null,
  member: null,
};


// --- Reusable UI Components ---
const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type="text" value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
  </div>
);

const Textarea = ({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea value={value} onChange={onChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
  </div>
);

// --- Main Admin Editor Page ---
const AdminSubscriptionEditor: NextPage = () => {
  const [data, setData] = useState<any>(defaultState);
  const { data: apiResponse, isLoading, refetch } = useGetAllSubscriptionPlansQuery();
  const [updateAdonsAndPlan, { isLoading: isUpdating }] = useUpdateAdonsAndPlanMutation();

  useEffect(() => {
    if (apiResponse && apiResponse.data) {
      const transformedData: any = {
        globalAddOns: [],
        store: null,
        brand: null,
        wholesaler: null,
        member: {
          typeName: 'Member Subscriptions',
          plans: [
            { id: 'member_free', title: 'Free Membership', price: '0', description: 'Perfect for new users who want to explore the full platform at no cost.', features: [{ id: 1, text: 'Join discussions, write reviews, and share product tips' }, { id: 2, text: 'Follow stores, brands, and advocacy groups for updates' }, { id: 3, text: 'Discover shops and products worldwide' }], type: 'member', badge: null }
          ],
          availableAddOnIds: []
        }
      };

      const addOnTypes = ['advocacy', 'hemp', 'location'];

      apiResponse.data.forEach((item: any) => {
        const planType = item.type;

        if (addOnTypes.includes(planType)) {
          transformedData.globalAddOns.push({
            id: item.id,
            title: item.name,
            price: parseFloat(item.price).toFixed(0),
            description: item.description,
            type: item.type,
            badge: item.badge,
          });
        } else if (['store', 'brand', 'wholesaler'].includes(planType)) {
          transformedData[planType] = {
            typeName: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription`,
            plan: {
              id: item.id,
              title: item.name,
              price: parseFloat(item.price).toFixed(0),
              description: item.description,
              features: (item.features || []).map((text: string, index: number) => ({ id: Date.now() + index, text })),
              type: item.type,
              badge: item.badge,
            },
            availableAddOnIds: [4, 6]
          };
        } else if (planType === 'member') {
          transformedData.member.plans.push({
            id: item.id,
            title: item.name,
            price: parseFloat(item.price).toFixed(0),
            description: item.description,
            features: (item.features || []).map((text: string, index: number) => ({ id: Date.now() + index, text })),
            type: item.type,
            badge: item.badge,
          });
          transformedData.member.availableAddOnIds = [6];
        }
      });

      setData(transformedData);
    }
  }, [apiResponse]);


  // --- State Handlers ---
  const handlePlanChange = (planType: 'store' | 'brand' | 'wholesaler', field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [planType]: { ...prev[planType], plan: { ...prev[planType].plan, [field]: value } } }));
  };

  const handleFeatureChange = (planType: 'store' | 'brand' | 'wholesaler', featureId: number, value: string) => {
    setData((prev: any) => ({ ...prev, [planType]: { ...prev[planType], plan: { ...prev[planType].plan, features: prev[planType].plan.features.map((f: Feature) => f.id === featureId ? { ...f, text: value } : f) } } }));
  };

  const handleAddFeature = (planType: 'store' | 'brand' | 'wholesaler') => {
    setData((prev: any) => {
      const newFeature = { id: Date.now(), text: '' };
      const updatedFeatures = [...prev[planType].plan.features, newFeature];
      return { ...prev, [planType]: { ...prev[planType], plan: { ...prev[planType].plan, features: updatedFeatures } } };
    });
  };

  const handleRemoveFeature = (planType: 'store' | 'brand' | 'wholesaler', featureId: number) => {
    setData((prev: any) => {
      const updatedFeatures = prev[planType].plan.features.filter((f: Feature) => f.id !== featureId);
      return { ...prev, [planType]: { ...prev[planType], plan: { ...prev[planType].plan, features: updatedFeatures } } };
    });
  };

  const handleMemberPlanChange = (planId: string | number, field: string, value: string) => {
    setData((prev: any) => ({ ...prev, member: { ...prev.member, plans: prev.member.plans.map((p: Plan) => p.id === planId ? { ...p, [field]: value } : p) } }));
  };

  const handleMemberFeatureChange = (planId: string | number, featureId: number, value: string) => {
    setData((prev: any) => ({ ...prev, member: { ...prev.member, plans: prev.member.plans.map((p: Plan) => p.id === planId ? { ...p, features: p.features.map((f: Feature) => f.id === featureId ? { ...f, text: value } : f) } : p) } }));
  };

  const handleMemberAddFeature = (planId: string | number) => {
    setData((prev: any) => {
      const newFeature = { id: Date.now(), text: '' };
      const updatedPlans = prev.member.plans.map((p: Plan) => {
        if (p.id === planId) {
          return { ...p, features: [...p.features, newFeature] };
        }
        return p;
      });
      return { ...prev, member: { ...prev.member, plans: updatedPlans } };
    });
  };

  const handleMemberRemoveFeature = (planId: string | number, featureId: number) => {
    setData((prev: any) => {
      const updatedPlans = prev.member.plans.map((p: Plan) => {
        if (p.id === planId) {
          return { ...p, features: p.features.filter((f: Feature) => f.id !== featureId) };
        }
        return p;
      });
      return { ...prev, member: { ...prev.member, plans: updatedPlans } };
    });
  };

  const handleGlobalAddOnChange = (addOnId: number, field: string, value: string) => {
    setData((prev: any) => ({ ...prev, globalAddOns: prev.globalAddOns.map((a: AddOn) => a.id === addOnId ? { ...a, [field]: value } : a) }));
  };

  // --- API Payload Transformation and Save Logic ---
  const handleSave = async (item: Plan | AddOn, itemType: 'plan' | 'addOn') => {
    let formData;

    let currentItem: Plan | AddOn | undefined = item;
    if (itemType === 'plan') {
      const plan = item as Plan;
      if (data.store?.plan.id === plan.id) currentItem = data.store.plan;
      else if (data.brand?.plan.id === plan.id) currentItem = data.brand.plan;
      else if (data.wholesaler?.plan.id === plan.id) currentItem = data.wholesaler.plan;
      else {
        currentItem = data.member?.plans.find((p: Plan) => p.id === plan.id);
      }
    } else {
      currentItem = data.globalAddOns.find((a: AddOn) => a.id === item.id);
    }

    if (!currentItem) {
      toast.error("Could not find the item to save.");
      return;
    }

    if (itemType === 'plan') {
      const plan = currentItem as Plan;
      // --- FIX APPLIED HERE ---
      // Changed the key from 'features[]' to 'features' to match common JSON API conventions.
      formData = {
        name: plan.title,
        price: plan.price,
        type: plan.type,
        badge: plan.badge || '',
        description: plan.description,
        features: plan.features.map(f => f.text), // Corrected key
        _method: 'PUT'
      };
    } else {
      const addOn = currentItem as AddOn;
      formData = {
        name: addOn.title,
        price: addOn.price,
        type: addOn.type,
        badge: addOn.badge || '',
        description: addOn.description,
        _method: 'PUT'
      };
    }

    console.log(`--- Saving Data for ID: ${currentItem.id} ---`);
    console.log('API formData:', formData);
    try {
      const response = await updateAdonsAndPlan({ planId: currentItem.id, formData }).unwrap();
      console.log('response', response);

      if (response?.ok) {
        toast.success(response.message || "Saved successfully");
        refetch();
      }

    } catch (error) {
      console.log('Error:', error);
      toast.error("An error occurred while saving.");
    }
  };

  // --- Render Functions ---
  const renderPlanEditor = (planType: 'store' | 'brand' | 'wholesaler') => {
    const planData = data[planType];
    if (!planData) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{planData.typeName}</h2>
        <div className="space-y-4">
          <Input label="Plan Title" value={planData.plan.title} onChange={(e) => handlePlanChange(planType, 'title', e.target.value)} />
          <Input label="Price ($)" value={planData.plan.price} onChange={(e) => handlePlanChange(planType, 'price', e.target.value)} />
          <Textarea label="Description" value={planData.plan.description} onChange={(e) => handlePlanChange(planType, 'description', e.target.value)} />

          <h3 className="text-lg font-semibold text-gray-700 pt-4 border-t mt-6">Features</h3>
          <div className="space-y-2">
            {planData.plan.features.map((feature: Feature) => (
              <div key={feature.id} className="flex items-center gap-2">
                <input type="text" value={feature.text} onChange={(e) => handleFeatureChange(planType, feature.id, e.target.value)} className="w-full text-sm p-2 border rounded-md" />
                <button onClick={() => handleRemoveFeature(planType, feature.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md">&times;</button>
              </div>
            ))}
          </div>
          <button onClick={() => handleAddFeature(planType)} className="w-full text-sm p-2 border-2 border-dashed rounded-md hover:bg-gray-50 text-gray-600">
            + Add Feature
          </button>

          <button onClick={() => handleSave(planData.plan, 'plan')} className="w-full mt-6 rounded bg-zinc-900 p-3 text-base font-medium text-white cursor-pointer hover:bg-zinc-700 transition-colors">
            Save {planData.typeName}
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading Subscription Data...</p></div>
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Admin Subscription Editor</h1>
        <p className="mt-2 text-lg text-gray-600">Edit all subscription plans and add-ons from one place.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Global Add-On Editor */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Global Add-On Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.globalAddOns.map((addOn: AddOn) => (
              <div key={addOn.id} className="p-4 border rounded-lg space-y-3 bg-gray-50 flex flex-col">
                <Input label="Add-On Title" value={addOn.title} onChange={(e) => handleGlobalAddOnChange(addOn.id, 'title', e.target.value)} />
                <Input label="Price ($)" value={addOn.price} onChange={(e) => handleGlobalAddOnChange(addOn.id, 'price', e.target.value)} />
                <Textarea label="Description" value={addOn.description} onChange={(e) => handleGlobalAddOnChange(addOn.id, 'description', e.target.value)} />
                <button onClick={() => handleSave(addOn, 'addOn')} className="w-full mt-auto rounded bg-black p-2 text-sm font-medium text-white cursor-pointer  transition-colors">
                  Save Add-On
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Business Plans */}
        {renderPlanEditor('store')}
        {renderPlanEditor('brand')}
        {renderPlanEditor('wholesaler')}

        {/* Member Plans */}
        {data.member && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{data.member.typeName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.member.plans.map((plan: Plan) => (
                <div key={plan.id} className="p-4 border rounded-lg space-y-3 flex flex-col">
                  <Input label="Plan Title" value={plan.title} onChange={(e) => handleMemberPlanChange(plan.id, 'title', e.target.value)} />
                  <Input label="Price ($)" value={plan.price} onChange={(e) => handleMemberPlanChange(plan.id, 'price', e.target.value)} />
                  <Textarea label="Description" value={plan.description} onChange={(e) => handleMemberPlanChange(plan.id, 'description', e.target.value)} />
                  <h4 className="text-md font-semibold text-gray-700 pt-2 border-t mt-4">Features</h4>
                  <div className="space-y-2">
                    {plan.features.map((feature: Feature) => (
                      <div key={feature.id} className="flex items-center gap-2">
                        <input type="text" value={feature.text} onChange={(e) => handleMemberFeatureChange(plan.id, feature.id, e.target.value)} className="w-full text-sm p-2 border rounded-md" />
                        <button onClick={() => handleMemberRemoveFeature(plan.id, feature.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md">&times;</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleMemberAddFeature(plan.id)} className="w-full text-sm p-2 border-2 border-dashed rounded-md hover:bg-gray-50 text-gray-600">
                    + Add Feature
                  </button>
                  <button onClick={() => handleSave(plan, 'plan')} className="w-full mt-auto rounded bg-zinc-900 p-2 text-sm font-medium text-white cursor-pointer hover:bg-zinc-700 transition-colors">
                    Save Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSubscriptionEditor;
